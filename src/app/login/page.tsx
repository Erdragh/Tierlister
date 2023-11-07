import LoginCard from "./login-card";

export default function LoginPage({ signup }: { signup: boolean }) {
  return (
    <>
      <LoginCard signup={signup} route={true} />
    </>
  );
}
