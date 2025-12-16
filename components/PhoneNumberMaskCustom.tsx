import React from "react";
import { IMaskInput } from 'react-imask';
import { InputBaseComponentProps } from "@mui/material";

// Расширяем стандартные пропсы Material-UI
interface PhoneNumberMaskCustomProps extends InputBaseComponentProps {
  name?: string; // Делаем name необязательным
}

export const PhoneNumberMaskCustom = React.forwardRef<
  HTMLInputElement, 
  PhoneNumberMaskCustomProps
>(function PhoneNumberMaskCustom(props, ref) {
  const { onChange, name = 'phone', ...other } = props;
  
  return (
    <IMaskInput
      {...other}
      mask="+{7} (000) 000 00 00"
      inputRef={ref}
      onAccept={(value: string) => {
        if (onChange) {
          // Создаем событие, совместимое с Material-UI
          const event = {
            target: { 
              name: name, 
              value: value 
            },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(event);
        }
      }}
      overwrite
    />
  );
});