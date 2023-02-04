import React, { FC } from "react";
import { User } from "../utils/users";
import { Round } from "../utils/rounds";

import s from "./RoundsTable.module.sass";

interface Props {
  rounds: Round[];
}

export const Group: FC<{ num: number; users: User[] }> = (props) => {
  const { num, users } = props;
  return (
    <div className={s.group}>
      <h3>Группа {num}</h3>
      <ul className={s.users}>
        {users.map((user, i) => (
          <li key={i}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

const RoundTable: FC<{ num: number; round: Round }> = (props) => {
  const { num, round } = props;
  const groups = round.map((group, i) => (
    <Group key={i} num={i + 1} users={group} />
  ));
  return (
    <div className={s.roundTable}>
      <h2>Раунд {num}</h2>
      <div className={s.groups}>{groups}</div>
    </div>
  );
};

export const RoundsTable: FC<Props> = (props) => {
  const { rounds } = props;
  const rows: JSX.Element[] = [];
  rounds.forEach((round, roundNumber) => {
    round.forEach((group, groupNumber) => {
      group.forEach((user) => {
        rows.push(
          <tr>
            <td style={{ textAlign: "center" }}>{roundNumber + 1}</td>
            <td style={{ textAlign: "center" }}>{groupNumber + 1}</td>
            <td>{user.name}</td>
          </tr>
        );
      });
    });
  });
  return (
    <table className={s.table} id="rounds_table">
      <thead>
        <th>Раунд</th>
        <th>Группа</th>
        <th>Фио</th>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};
