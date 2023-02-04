import React, { FC } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";

import s from "./Form.module.sass";

interface IProps {
  onSubmit: (e: any) => void;
}

export const Form: FC<IProps> = (props) => {
  const { onSubmit } = props;

  const { handleSubmit, register } = useForm();

  return (
    <form className={s.root} onSubmit={handleSubmit(onSubmit)} method="POST">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            {...register("users")}
            label="Список участников"
            placeholder="Вставьте список участников. Каждый участник в новой строке"
            multiline
            fullWidth
            minRows={3}
            maxRows={10}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register("numGroups")}
            label="Количество групп"
            variant="standard"
            fullWidth
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register("numRounds")}
            label="Количество раундов"
            variant="standard"
            fullWidth
            type="number"
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" color="primary" fullWidth>
            Рассчитать
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
