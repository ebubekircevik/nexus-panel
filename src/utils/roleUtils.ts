export const USER_ROLES = [
  { value: "Admin", label: "Admin" },
  { value: "Manager", label: "Manager" },
  { value: "User", label: "User" },
];

export const getRoleColor = (role: string): string => {
  const colors: Record<string, string> = {
    Admin: "red",
    Manager: "orange",
    User: "blue",
  };
  return colors[role] || "default";
};

