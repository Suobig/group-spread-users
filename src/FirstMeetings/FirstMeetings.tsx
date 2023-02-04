import React, { FC } from "react";
import { UserFirstMeetings } from "../utils/users";

import s from "./FirstMeetings.module.sass";

function getColor(n: number) {
  switch (n) {
    case 0:
      return "orange";
    case 1:
      return "yellow";
    default:
      return "unset";
  }
}

const ColoredNumber: FC<{ n: number }> = ({ n }) => {
  const color = getColor(n);

  return <span style={{ backgroundColor: color, padding: "3px" }}>{n}</span>;
};

export const FirstMeetings: FC<{
  meetings: UserFirstMeetings[];
  neverMetByUser: Record<number, number>;
}> = (props) => {
  const { meetings, neverMetByUser } = props;
  const roundNumbers = meetings[0].firstMetByRound.map((_, i) => (
    <th>{i + 1}</th>
  ));
  meetings.sort(
    (first, second) => neverMetByUser[second.id] - neverMetByUser[first.id]
  );
  return (
    <table className={s.root}>
      <thead>
        <th>ФИО</th>
        {roundNumbers}
        <th>Не встретил</th>
      </thead>
      <tbody>
        {meetings.map((user) => {
          const neverMet = neverMetByUser[user.id];
          return (
            <tr>
              <td>{user.name}</td>
              {user.firstMetByRound.map((i) => (
                <td>
                  <ColoredNumber n={i} />
                </td>
              ))}
              <td>{neverMet}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
