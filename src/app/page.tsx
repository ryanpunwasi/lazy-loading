import { Stack } from "@mui/material";
import CommentList from "./components/CommentList";

export default async function Home() {
  const request = await fetch(
    "https://jsonplaceholder.typicode.com/comments?_start=0&_limit=15"
  );

  const comments = await request.json();

  return (
    <main
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
      }}
    >
      <Stack
        width={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
        sx={{ minHeight: "100%" }}
        padding={"1em"}
      >
        <CommentList initialComments={comments} />
      </Stack>
    </main>
  );
}
