import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
//import FormControl from "@mui/material/FormControl";
//import { useMediaQuery, useTheme } from "@mui/material";
//import toast, { Toaster } from "react-hot-toast";
//import { useActionData, useLoaderData } from "remix";

export default function EditProfile() {
  //const data = useLoaderData();
  // console.log(data);
  //const theme = useTheme();
  //  const mobileScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1 },
        p: 1,
      }}
      noValidate
      autoComplete="off"
      method="POST"
      //onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        required
        //error={!!errors.name}
        //helperText={errors.name?.message}
        //defaultValue={value}
        fullWidth
        id="outlined-required"
        size="small"
        label="Client Name"
        placeholder="John Doe"
      />

      <TextField
        required
        //error={!!errors.phone}
        // helperText={errors.phone?.message}
        sx={{ width: "70%" }}
        //  defaultValue={value}
        id="outlined-required"
        size="small"
        placeholder="222-2222-222"
        label="Client Telephone"
      />

      <TextField
        required
        //error={!errors.address}
        //helperText={errors.address?.message}
        sx={{ width: "70%" }}
        // defaultValue={value}
        id="outlined-required"
        size="small"
        placeholder=" xxx example street"
        label="Client Address"
      />

      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button size="small" type="submit" color="warning" variant="contained">
          Submit Order
        </Button>
      </Box>
    </Box>
  );
}
