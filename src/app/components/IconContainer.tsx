"use client";
import { styled } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GitHubIcon from "@mui/icons-material/GitHub";

const IconContainer = () => {
  return (
    <IconContainerStyled>
      <a href="https://ryansoftware.netlify.app" target="_blank">
        <AccountCircleIcon
          style={{
            fontSize: "27px",
            marginTop: "3px",
          }}
        />
      </a>
      <a href="https://github.com/ryanpunwasi/lazy-loading" target="_blank">
        <GitHubIcon />
      </a>
    </IconContainerStyled>
  );
};

const IconContainerStyled = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    left: 50,
    right: 50,
    justifyContent: "space-between",
  },
  position: "absolute",
  top: 20,
  right: 100,
  fontSize: "27px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "1em",
}));

export default IconContainer;
