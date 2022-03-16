import * as React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useMediaQuery, useTheme } from "@mui/material";

export default function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Container maxWidth="md" sx={{ px: 5, mt: 5 }}>
      <Grid container spacing={isMobile ? 1 : 3}>
        <Grid item xs={12} sm={12} md={7}>
          <img
            style={{
              height: isMobile ? 200 : 500,
              width: isMobile ? 310 : 500,
            }}
            src="/home/undraw_organize_resume_re_k45b.svg"
            alt=""
          />
        </Grid>
        <Grid item xs={12} sm={12} md={5}>
          {children}
        </Grid>
      </Grid>
    </Container>
  );
}
