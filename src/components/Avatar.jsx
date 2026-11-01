import React from "react";
export default function Avatar({ name = "User", color = "blue", size = "md" }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className={`avatar avatar-${color} avatar-${size}`}>{initials}</span>
  );
}
