"use client"

import { Question } from "@/types/quiz"
import { Box, Paper, Typography, Button, Stack } from "@mui/material"

type Props = {
  question: Question
  onAnswer: (value: Record<string, number>) => void
}

export function QuestionComponent({ question, onAnswer }: Props) {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
      sx={{
        background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)"
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 520,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          bgcolor: "#161616",
          backdropFilter: "blur(8px)"
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          textAlign="center"
          mb={4}
          color="grey.100"
        >
          {question.text}
        </Typography>

        <Stack spacing={2}>
          {question.options.map((opt) => (
            <Button
              key={opt.label}
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => onAnswer(opt.value)}
              sx={{
                py: 2,
                borderRadius: 3,
                fontSize: "1rem",
                fontWeight: 500,
                textTransform: "none",
                color: "grey.100",
                borderColor: "grey.700",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "primary.main",
                  boxShadow: "0 0 12px rgba(99,102,241,0.6)"
                },
                "&:active": {
                  transform: "scale(0.97)"
                }
              }}
            >
              {opt.label}
            </Button>
          ))}
        </Stack>
      </Paper>
    </Box>
  )
}