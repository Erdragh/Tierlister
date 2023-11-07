import { useContext } from "react";
import { UserContext } from "../../context/user-context";

export default function AccountPage() {
  const userContext = useContext(UserContext);
  return userContext.requireLogin(
    <>
      <div>
        <span>Username:</span>
        <span>{userContext.username}</span>
      </div>
      <div>
        <span>E-Mail:</span>
        <span>{userContext.email}</span>
        <span>{userContext.verified ? "Verified" : "Not Verified"}</span>
      </div>
    </>
  );
}
