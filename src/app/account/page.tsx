import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user-context";

export default function AccountPage() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  return userContext.requireLogin(
    <>
      <div>
        <span>Username:</span>
        <span>{userContext.username}</span>
      </div>
    </>,
    navigate
  );
}
