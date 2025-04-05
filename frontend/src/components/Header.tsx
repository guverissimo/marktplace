import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import React, { useEffect } from "react";
import { Button } from "./ui/Button";
import { ToggleButton } from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selected, setSelected] = React.useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };
  return (
    <nav className="bg-blue-500 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard">
              <h1 className="text-xl font-semibold text-white">Dashboard</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Olá, {user.name}</span>
            <ToggleButton
              value="check"
              selected={selected}
              onChange={() => setSelected((prevSelected) => !prevSelected)}
            >
              <Brightness4Icon sx={{ color: 'white' }} className="border-none"  />
            </ToggleButton>
            <Button variant="secondary" onClick={handleProfile}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
