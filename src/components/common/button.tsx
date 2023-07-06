import { ComponentProps, FC, ReactNode } from "react";

type Props = ComponentProps<"button"> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "warning" | "muted";
  customClass?: string;
};

const Button: FC<Props> = ({
  children,
  variant = "primary",
  customClass = "",
  ...props
}) => {
  const handleVariant = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 text-white hover:bg-blue-400";
      case "secondary":
        return "bg-";
      case "warning":
        return "bg-red-600 text-white hover:bg-red-400";
      case "muted":
        return "bg-gray-600 text-white hover:bg-gray-400";
    }
  };
  return (
    <button
      className={`px-2 py-2 font-bold rounded-md w-full ${handleVariant()} ${customClass}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
