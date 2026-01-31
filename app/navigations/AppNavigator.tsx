import React, { useState } from "react";
import AuthNavigator from "./AuthNavigator";
import UserNavigator from "./UserNavigator";

export default function AppNavigator() {
  // Mock authentication state. Change to true to see UserNavigator.
  const [isAuthenticated] = useState(true);

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  return <UserNavigator />;
}
