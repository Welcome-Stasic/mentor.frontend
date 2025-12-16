import {
  IconButton,
  TextField,
  Tooltip,
  Typography,
  InputBaseComponentProps,
  Box,
} from "@mui/material";
import { useEffect, useState, ElementType } from "react";
import { PhoneNumberMaskCustom } from "../PhoneNumberMaskCustom";
import { useUpdateNumber } from "@/hooks/user/useUpdateNumber";
import SaveIcon from "@mui/icons-material/Save";

interface INumberInputProps {
  juniorId: string;
  juniorPhone: string;
}

const NumberInput = ({ juniorId, juniorPhone }: INumberInputProps) => {
  const [phoneNumbers, setPhoneNumbers] = useState<Record<string, string>>({});
  const [phoneError, setPhoneError] = useState<Record<string, boolean>>({});
  const [isTouched, setIsTouched] = useState<Record<string, boolean>>({});
  const updateNumber = useUpdateNumber();
  const validatePhoneNumber = (phone: string): boolean => {
    return phone.length > 0 && phone.length !== 18;
  };

  const handleNumberChange =
    (juniorId: string) =>
    (event: { target: { name: string; value: string } }) => {
      const value = event.target.value;

      setPhoneNumbers((prev) => ({
        ...prev,
        [juniorId]: value,
      }));

      setIsTouched((prev) => ({
        ...prev,
        [juniorId]: true,
      }));

      const hasError = validatePhoneNumber(value);
      setPhoneError((prev) => ({
        ...prev,
        [juniorId]: hasError,
      }));
    };

  const handleBlur = (juniorId: string) => () => {
    setIsTouched((prev) => ({
      ...prev,
      [juniorId]: true,
    }));

    const currentPhone = phoneNumbers[juniorId] || juniorPhone || "";
    const hasError = validatePhoneNumber(currentPhone);
    setPhoneError((prev) => ({
      ...prev,
      [juniorId]: hasError,
    }));
  };
  const handleNumberSave = (userId: string) => () => {
    handleNumberSaveAPI(userId);
  };
  const handleNumberSaveAPI = async (userId: string) => {
    const phoneNumber = phoneNumbers[userId] || juniorPhone;
    if (canSave()) {
      await updateNumber.mutateAsync({
        userId: juniorId,
        phoneNumber: phoneNumber,
      });
    }
  };

  useEffect(() => {
    if (juniorId) {
      const initialPhone = juniorPhone || "";

      setPhoneNumbers((prev) => ({
        ...prev,
        [juniorId]: initialPhone,
      }));

      setIsTouched((prev) => ({
        ...prev,
        [juniorId]: false,
      }));

      const hasError = initialPhone.length > 0 && initialPhone.length !== 18;
      setPhoneError((prev) => ({
        ...prev,
        [juniorId]: hasError,
      }));
    }
  }, [juniorId, juniorPhone]);

  const canSave = () => {
    const currentPhone = phoneNumbers[juniorId] || juniorPhone || "";
    const hasError = phoneError[juniorId] || false;
    const wasTouched = isTouched[juniorId] || false;
    return (
      wasTouched &&
      !hasError &&
      currentPhone.length > 0 &&
      currentPhone !== juniorPhone
    );
  };

  return (
    <Box
      color="text.secondary"
      sx={{ display: "flex", alignItems: "center" }}
    >
      Телефон:
      <TextField
        onChange={handleNumberChange(String(juniorId))}
        onBlur={handleBlur(String(juniorId))}
        value={phoneNumbers[juniorId] || juniorPhone || ""}
        sx={{
          width: "150px",
          marginLeft: "10px",
          "& .MuiInput-input": {
            fontSize: "14px",
          },
        }}
        variant="standard"
        name="phone"
        InputProps={{
          inputComponent:
            PhoneNumberMaskCustom as ElementType<InputBaseComponentProps>,
        }}
      />
      <Tooltip title="Поменять номер">
        <IconButton
          loading={updateNumber.isPending}
          disabled={!canSave()}
          color="success"
          onClick={handleNumberSave(String(juniorId))}
          aria-label="Сохранить номер"
        >
          <SaveIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default NumberInput;
