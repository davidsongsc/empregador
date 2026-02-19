"use client"

import { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material"

export default function MarketPage() {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [items, setItems] = useState<MarketItem[]>([])

  function addItem() {
    if (!name || !price) return

    setItems(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        price: Number(price)
      }
    ])

    setName("")
    setPrice("")
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
      bgcolor="#fffefe"
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 600,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          bgcolor: "#7c7c7c"
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          color="grey.100"
          mb={3}
          textAlign="center"
        >
          Lista de Mercado
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
          <TextField
            fullWidth
            label="Item"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Valor"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
          <Button
            variant="contained"
            size="large"
            onClick={addItem}
            sx={{
              px: 3,
              borderRadius: 3,
              textTransform: "none"
            }}
          >
            Adicionar
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <List>
          {items.map(item => (
            <ListItem key={item.id} disableGutters>
              <ListItemText
                primary={item.name}
                secondary={`R$ ${item.price.toFixed(2)}`}
                primaryTypographyProps={{ color: "grey.100" }}
                secondaryTypographyProps={{ color: "grey.400" }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  )
}