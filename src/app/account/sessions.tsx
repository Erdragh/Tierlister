import { useContext, useEffect, useState } from "react";
import Button from "../../components/button";
import { UserContext, UserContextSession } from "../../context/user-context";

export default function Sessions() {
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(userContext.fetchSessions);
    setLoading(true);
    userContext
      .fetchSessions()
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [userContext.fetchSessions, setLoading]);

  return (
    <div>
      <span>Sessions</span>
      {loading ? (
        <>Loading...</>
      ) : (
        userContext.sessions?.map((s) => (
          <Session
            key={s.id}
            {...s}
            logout={() => {
              setLoading(true);
              userContext
                .logoutSession(s.id)
                .then(() =>
                  userContext.fetchSessions().then(() => setLoading(false))
                )
                .catch(() => setLoading(false));
            }}
          />
        ))
      )}
    </div>
  );
}

function Session({
  ip,
  creationDate,
  client,
  current,
  logout,
}: UserContextSession & { logout: () => void }) {
  return (
    <div>
      <div>
        {client} {current && <span>Current</span>}
      </div>
      <div>
        <span>{ip}</span>
        <span>{creationDate.toISOString()}</span>
      </div>
      {!current && <Button onClick={logout}>Log out of Session</Button>}
    </div>
  );
}
