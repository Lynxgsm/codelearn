import { ComponentProps, FC } from "react";

type InputProps = ComponentProps<"input"> & {
  label?: string;
  info?: string;
  state?: "valid" | "error";
  wide?: boolean;
};

const Input: FC<InputProps> = ({ state = "valid", wide = true, ...props }) => {
  return (
    <div className={`flex flex-col gap-2 ${wide ? "w-full" : "w-auto"}`}>
      <label htmlFor={props.name} className="text-slate-500">
        {props.label ?? props.name}{" "}
        {props.required && <sup className="text-red-500">*</sup>}
      </label>
      <input
        {...props}
        className={`rounded-md w-full text-slate-900 ${
          state === "valid" ? "border-gray-200" : "border-red-500"
        } border-2 p-2`}
        type={props.type ?? "text"}
      />
      <small className="text-blue-500 text-xs">{props.info}</small>
    </div>
  );
};

export default Input;
