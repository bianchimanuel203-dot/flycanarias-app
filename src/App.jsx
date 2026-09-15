import { useState } from "react";
import LoginScreen from "./LoginScreen";
import FlyCanariasApp from "./FlyCanarias";

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginScreen onLogin={(u) => setUser(u)} />;
  }

  return <FlyCanariasApp user={user} />;
}
