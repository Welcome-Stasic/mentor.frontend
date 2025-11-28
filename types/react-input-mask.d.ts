declare module "react-input-mask" {
  import * as React from "react";

  export interface InputMaskProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    mask: string;
    maskChar?: string | null;
  }

  const InputMask: React.FC<InputMaskProps>;

  export default InputMask;
}
