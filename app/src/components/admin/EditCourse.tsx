import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

export default function EditCourse() {
  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1 },
        p: 4,
      }}
      noValidate
      autoComplete="off"
      method="POST"
      //onSubmit={handleSubmit(onSubmit)}
    >
      <div>
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

        <TextField
          required
          // error={!!errors.prefix}
          //  helperText={errors.prefix?.message}
          sx={{ width: "18%", ml: "80px" }}
          id="outlined-required"
          size="small"
          label="Awb Prefix"
          //defaultValue={value}
          placeholder="001"
        />

        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ flexDirection: "row", alignItems: "center" }}>
            <TextField
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              id="outlined-required"
              //defaultValue={'xxxxxxxx'}
              //defaultValue={value}
              // error={!!errors.track_number}
              placeholder="Generate code"
              // helperText={errors.track_number?.message}
              sx={{ width: "50%" }}
              size="small"
              label="Tracking Number"
              InputLabelProps={{ shrink: true }}
            />
            {/*<Controller
                            name="status"
                            control={control}
                            defaultValue={defaultValue.trim() as Status}
                              
                            render={({ field: { onChange, value, onBlur } }) => (
                                <FormControl sx={{ mt: 1, ml: 4 }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        label="Status"
                                        size="small"
                                        value={value}
                                     
                                        onChange={onChange}
                                        onBlur={onBlur}
                                    >
                                        {
                                            ['RECIEVED', 'PENDING', 'SENT'].map((item, index) =>
                          
                                                <MenuItem key={index} value={item}>{item}</MenuItem>
                                            )
                                        }
                                    </Select>
                                </FormControl>
                            )} />
                                    */}
          </Box>

          <Button size="small" sx={{ mt: 1, width: "40%" }} variant="contained">
            Generate Tracking Number
          </Button>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            size="small"
            type="submit"
            color="warning"
            variant="contained"
          >
            Submit Order
          </Button>
        </Box>
      </div>
    </Box>
  );
}
