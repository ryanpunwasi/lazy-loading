"use client";

import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useFetchPermission } from "../hooks/useFetchPermission.hook";
import { useLoading } from "../hooks/useLoading.hook";
import { useScrollInfo } from "../hooks/useScrollInfo.hook";
import "./CommentList.module.css";

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
  const [start, setStart] = useState(0);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const { allowFetch, setAllowFetch } = useFetchPermission(true);
  const { loading, setLoading, loadingRef } = useLoading({
    scrollBehaviour: "smooth",
  });
  const { scrollRef: ref, isAtBottom } = useScrollInfo();

  const renderedComments = comments.map(comment => (
    <CommentListItem comment={comment} key={comment.id}></CommentListItem>
  ));

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
        const fetchedComments: Comment[] = await fetchComments(
          start + PAGE_SIZE,
          PAGE_SIZE
        );

        if (fetchedComments.length > 0) {
          setStart(prev => prev + PAGE_SIZE);
          setComments([...comments, ...fetchedComments]);
        } else {
          setAllowFetch(false);
        }
      } catch (e) {
        setAllowFetch(false);
      }

      setLoading(false);
    }
  };

  const fetchComments = async (start: number, limit: number) => {
    const req = await fetch(
      `https://jsonplaceholder.typicode.com/comments?_start=${start}&_limit=${limit}`
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
        border={prefersDarkMode ? `1px solid #2C2C2C` : "none"}
        borderRadius={"10px"}
        px={"1em"}
        pt={"1em"}
        id="commentsContainer"
        bgcolor={prefersDarkMode ? "" : "#fff"}
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
        <IconButton color="info">
          <ThumbUpAltOutlinedIcon />
        </IconButton>
        <IconButton color="info">
          <ThumbDownAltOutlinedIcon />
        </IconButton>
        <Button variant="text" color="info">
          Reply
        </Button>
      </Stack>
    </div>
  );
};

const Email = styled("p")(({ theme }) => ({
  ...theme.typography.subtitle2,
  fontWeight: "bold",
  marginBottom: "5px",
}));

const CommentBody = styled("p")(({ theme }) => ({
  ...theme.typography.body2,
}));

export default CommentList;
