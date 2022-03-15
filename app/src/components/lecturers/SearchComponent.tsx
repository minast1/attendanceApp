import * as React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import  Button  from '@mui/material/Button';
import { useMediaQuery, useTheme } from '@mui/material';


type appType = {
  search: string
}

export default function Search({ search}: appType) {
  const theme = useTheme();
  const mobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <div>
        <Grid container spacing={2}>
          <Grid item xs={5} sm={6} md={5}>
           <Autocomplete
              freeSolo
              id="free-solo-2-demo"
              size="small"
              disableClearable
              options={['100','200','300','400','500'].map((option) => option)}
              renderInput={(params) => (
                <TextField
            {...params}
                label="Index Number"
                
               
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
            />
          </Grid>
          <Grid item xs={7} sm={6} md={5}>
            <Button variant="contained" color="warning" size={mobileScreen ? 'small' : 'medium'}>{search}</Button>
          </Grid>
      
            </Grid>
            </div>
  );

}