"use client";

import { useState, useRef, useEffect } from "react";
import {
  Stack,
  IconButton,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import { styled } from "@mui/material/styles";
import { PAGE_SIZE, PIXEL_THRESHOLD } from "../config";

type Props = {
  initialComments: Comment[];
};

type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

const CommentList = ({ initialComments }: Props) => {
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(false);
  const [allowFetch, setAllowFetch] = useState(true);
  const [start, setStart] = useState(0);
  const renderedComments = comments.map(comment => (
    <CommentListItem comment={comment} key={comment.id}></CommentListItem>
  ));

  const ref = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loading) loadingRef.current?.scrollIntoView({ behavior: "instant" });
  }, [loading]);

  const onScroll = async () => {
    if (!allowFetch) return;

    const params = {
      scrollHeight: ref?.current?.scrollHeight || 0,
      scrollTop: ref?.current?.scrollTop || 0,
      clientHeight: ref?.current?.clientHeight || 0,
      pixelThreshold: PIXEL_THRESHOLD,
    };

    if (!loading && isAtBottom(params)) {
      setLoading(true);
      await new Promise(r => setTimeout(r, 500));

      try {
        const fetchedComments = await fetchComments(
          start + PAGE_SIZE,
          PAGE_SIZE
        );
        setStart(prev => prev + PAGE_SIZE);
        setComments([...comments, ...fetchedComments]);
        setLoading(false);
      } catch (e) {
        setAllowFetch(false);
        setLoading(false);
      }
    }
  };

  const isAtBottom = ({
    scrollHeight,
    scrollTop,
    clientHeight,
    pixelThreshold,
  }: {
    scrollHeight: number;
    scrollTop: number;
    clientHeight: number;
    pixelThreshold: number;
  }): boolean => {
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return (
      distanceFromBottom <= pixelThreshold &&
      distanceFromBottom >= -pixelThreshold
    );
  };

  const fetchComments = async (start: number, limit: number) => {
    const req = await fetch(
      `https://jsonplaceholder.typicode.com/commens?_start=${start}&_limit=${limit}`
    );

    return await req.json();
  };

  return (
    <>
      <Typography textAlign={"start"} mb={"0.25em"}>
        {comments.length} comments
      </Typography>
      <Stack
        onScroll={onScroll}
        ref={ref}
        width={"100%"}
        maxWidth={"500px"}
        maxHeight={"70%"}
        overflow={"scroll"}
        gap={"1.5em"}
        border={"1px solid #2C2C2C"}
        borderRadius={"10px"}
        px={"1em"}
        pt={"1em"}
        bgcolor={"101010"}
        id="commentsContainer"
      >
        {renderedComments}
        {loading && (
          <Stack
            ref={loadingRef}
            alignItems={"center"}
            justifyContent={"center"}
            mb={"2em"}
          >
            <CircularProgress color="primary" />
          </Stack>
        )}
      </Stack>
    </>
  );
};

const CommentListItem = ({ comment }: { comment: Comment }) => {
  return (
    <div>
      <Email>{comment.email}</Email>
      <CommentBody>{comment.body}</CommentBody>
      <Stack direction={"row"} mt={"0.5em"} gap={"0.4em"}>
        <IconButton style={{ color: "white" }}>
          <ThumbUpAltOutlinedIcon />
        </IconButton>
        <IconButton style={{ color: "white" }}>
          <ThumbDownAltOutlinedIcon />
        </IconButton>
        <Button variant="text" style={{ color: "#38bdf8" }}>
          Reply
        </Button>
      </Stack>
    </div>
  );
};

const Email = styled("p")(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: "#fafafa",
  fontWeight: "bold",
  marginBottom: "5px",
}));

const CommentBody = styled("p")(({ theme }) => ({
  ...theme.typography.body2,
  color: "#d4d4d8",
}));

export default CommentList;
