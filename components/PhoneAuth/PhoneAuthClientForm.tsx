// "use client";
// import {
//   Button,
//   Grid,
//   Typography,
//   TextField,
//   FormControl,
//   InputLabel,
//   OutlinedInput,
// } from "@mui/material";
// import { useForm, Controller, SubmitHandler } from "react-hook-form";
// import { useState } from "react";
// import BackdropLoader from "../BackdropLoader";
// import { PhoneNumberMaskCustom } from "../PhoneNumberMaskCustom";
// import { API } from "@/lib/axios";
// import { handleSignIn } from "@/lib/utils/handleSignIn";

// interface IPhoneForm {
//   phone: string;
// }

// interface ICodeForm {
//   code: string;
// }

// export default function PhoneAuthClientForm() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [sentPhone, setSentPhone] = useState<string | null>(null);
//   // const [isAuthorized, setIsAuthorized] = useState(false);

//   const phoneForm = useForm<IPhoneForm>({ defaultValues: { phone: "" } });
//   const codeForm = useForm<ICodeForm>();

//   const handlePhoneSMS: SubmitHandler<IPhoneForm> = async (data) => {
//     setIsLoading(true);

//     const phone = data.phone;

//     const response: any = await API.auth.sendSMSCode(phone);

//     if (response.data?.success) {
//       setSentPhone(data.phone);
//     } else {
//       phoneForm.setError("phone", {
//         message: response.data?.Message || "Введите корректный номер",
//       });
//     }

//     setIsLoading(false);
//   };

//   const handleLoginByCode: SubmitHandler<ICodeForm> = async (data) => {
//     if (!sentPhone) return;

//     setIsLoading(true);

//     const response: any = await API.auth.loginBySMSCode(sentPhone, data.code);

//     if (response.data?.refresh_token) {
//       // setIsAuthorized(true);
//       await handleSignIn(
//         response.data?.login,
//         response.data?.password,
//         response.data.isElma
//       );
//     } else {
//       codeForm.setError("code", {
//         message: response.data?.Message || "Неверный код",
//       });
//     }

//     setIsLoading(false);
//   };

//   return (
//     <>
//       <BackdropLoader open={isLoading} />
//       <>
//         {!sentPhone ? (
//           <Grid
//             container
//             component="form"
//             spacing={2}
//             direction="column"
//             onSubmit={phoneForm.handleSubmit(handlePhoneSMS)}
//             sx={{ width: "100%" }}
//           >
//             <Controller
//               name="phone"
//               control={phoneForm.control}
//               rules={{ required: "Введите номер телефона" }}
//               render={({ field, fieldState }) => (
//                 <FormControl fullWidth error={!!fieldState.error}>
//                   <InputLabel htmlFor="phone-input">Номер телефона</InputLabel>
//                   <OutlinedInput
//                     id="phone-input"
//                     label="Номер телефона"
//                     inputComponent={PhoneNumberMaskCustom as any}
//                     {...field}
//                   />
//                 </FormControl>
//               )}
//             />

//             <Button type="submit" variant="contained" fullWidth>
//               Получить СМС
//             </Button>
//           </Grid>
//         ) : (
//           <>
//             <Typography sx={{ mb: 2 }}>
//               СМС отправлено на номер <b>{sentPhone}</b>
//             </Typography>

//             <Grid
//               container
//               component="form"
//               spacing={2}
//               direction="column"
//               onSubmit={codeForm.handleSubmit(handleLoginByCode)}
//               sx={{ width: "100%" }}
//             >
//               <Controller
//                 name="code"
//                 control={codeForm.control}
//                 rules={{ required: "Введите код" }}
//                 render={({ field, fieldState }) => (
//                   <TextField
//                     {...field}
//                     label="Введите код"
//                     fullWidth
//                     error={!!fieldState.error}
//                     helperText={fieldState.error?.message}
//                   />
//                 )}
//               />

//               <Button type="submit" variant="contained" fullWidth>
//                 Войти
//               </Button>
//             </Grid>
//           </>
//         )}
//       </>
//     </>
//   );
// }
