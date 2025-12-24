"use client";

import { useMemo, useState } from "react";
import { useUserPhoto } from "@/hooks/useUserPhoto";
import { useUserJuniors } from "@/hooks/user/useUserJuniors";
import { useUserJuniorsOld } from "@/hooks/user/useUserJuniorsOld";
import { useCurrentUserStore } from "@/providers/current-user-provider";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
  Button,
  Modal,
} from "@mui/material";
import EmailInput from "@/components/ui/EmailInput";
import NumberInput from "@/components/ui/NumberInput";

interface UserType {
  appId: string;
  photoUrl: string;
  name: string;
  email: string;
  phone: string;
  departmentName: string;
}
interface juniorCardProps {
  junior: UserType;
}
function CurrentJuniorCard({ junior }: juniorCardProps) {
  const photoResult = useUserPhoto(junior.appId, junior.photoUrl);

  const photoUrl = useMemo(
    () => photoResult?.data?.url ?? junior.photoUrl ?? "",
    [photoResult?.data, junior.photoUrl]
  );

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={photoUrl || "/assets/default-avatar.png"}
        alt={junior.name}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          gap: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography component="div" variant="h6" gutterBottom>
          {junior.name}
        </Typography>
        <Box>
          <EmailInput userId={junior.appId} email={junior.email} />
        </Box>
        <Box sx={{ display: "flex" }}>
          <NumberInput
            juniorId={String(junior.appId)}
            juniorPhone={junior.phone}
          />
        </Box>
        <Typography component="div" variant="body2" color="text.secondary">
          Подразделение: {junior.departmentName}
        </Typography>
      </CardContent>
    </Card>
  );
}

function OldJuniorCard({ junior }: juniorCardProps) {
  const photoResult = useUserPhoto(junior.appId, junior.photoUrl);

  const photoUrl = useMemo(
    () => photoResult?.data?.url ?? junior.photoUrl ?? "",
    [photoResult?.data, junior.photoUrl]
  );

  return (
    <Card
      sx={{
        padding: "10px",
        width: "100%",
        height: "100%",
        display: "flex",
        borderRadius: 2,
        boxShadow: 2,
        marginBottom: "10px",
      }}
    >
      <CardMedia
        component="img"
        image={photoUrl || "/assets/default-avatar.png"}
        alt={junior.name}
        sx={{ width: "100px" }}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          gap: 1,
          display: "flex",
        }}
      >
        <Box>
          <Typography variant="h6" component="div" alignItems="center">
            {junior.name}
          </Typography>
          <Typography component="div" variant="body2" color="text.secondary">
            email: {junior.email}
          </Typography>
          <Typography component="div" variant="body2" color="text.secondary">
            Телефон: {junior.phone}
          </Typography>
          <Typography component="div" variant="body2" color="text.secondary">
            Подразделение: {junior.departmentName}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function MyJuniorsPage() {
  const [open, setOpen] = useState(false);
  const handleOpenAlljuniors = () => setOpen(true);
  const handleCloseAlljuniors = () => setOpen(false);
  const crmId = useCurrentUserStore((store) => store.elmaId) ?? "";

  const juniorResult = useUserJuniors(crmId);
  const juniors = juniorResult.data ?? [];

  const juniorOldResult = useUserJuniorsOld(crmId);
  const OldJuniors = juniorOldResult.data ?? [];

  if (juniorResult.isPending) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box mt={2}>
      <Button
        color="primary"
        variant="contained"
        onClick={handleOpenAlljuniors}
        sx={{ mb: 2, width: "max-content", fontSize: "10px" }}
      >
        Уволенные стажёры
      </Button>
      <Modal open={open} onClose={handleCloseAlljuniors}>
        <Box>
          <Box
            sx={{
              maxHeight: "80dvh",
              overflowY: "scroll",
              overflowX: "hidden",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              p: "24px",
              backgroundColor: "#fff",
              borderRadius: "4px",
              maxWidth: "900px",
              width: "100%",
            }}
          >
            <Box>
              {OldJuniors.length === 0 ? (
                <Typography
                  component="div"
                  variant="body1"
                  color="text.secondary"
                >
                  У вас пока нет уволенных стажёров.
                </Typography>
              ) : (
                <Box>
                  <Typography variant="h6" component="h2">
                    Уволенные стажёры
                  </Typography>
                  {OldJuniors.map((Oldjunior) => (
                    <Grid key={Oldjunior.id}>
                      <OldJuniorCard junior={Oldjunior} />
                    </Grid>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
      {juniors.length === 0 ? (
        <Typography component="p" variant="body1" color="text.secondary">
          У вас пока нет стажёров.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {juniors.map((junior) => (
            <Grid key={junior.id} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
              <CurrentJuniorCard junior={junior} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
