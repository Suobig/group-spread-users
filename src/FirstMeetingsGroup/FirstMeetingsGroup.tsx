import React, { FC } from "react";
import _ from "lodash";

import { UserFirstMeetings } from "../utils/users";
import { Round } from "../utils/rounds";

import s from "./FirstMeetingsGroup.module.sass";

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

type GroupMeetingsByRound = {
  name: string;
  meetingsByRound: number[];
};

export const FirstMeetingsGroup: FC<{
  meetings: UserFirstMeetings[];
  rounds: Round[];
}> = (props) => {
  const { meetings, rounds } = props;
  const roundNumbers = meetings[0].firstMetByRound.map((_, i) => (
    <th>{i + 1}</th>
  ));

  const meetingsByUser = _.keyBy(meetings, "id");
  console.log("meetings", meetings);
  console.log("meetingsByUser", meetingsByUser);
  const groupMeetings = rounds.reduce<Record<number, GroupMeetingsByRound>>(
    (acc, round, roundNumber) => {
      round.forEach((group, groupNumber) => {
        const meetings = group.reduce(
          (total, user) =>
            total +
            _.get(
              meetingsByUser,
              `${user.id}.firstMetByRound[${roundNumber}]`,
              0
            ),
          0
        );
        if (!(groupNumber in acc)) {
          acc[groupNumber] = {
            name: `Группа ${groupNumber + 1}`,
            meetingsByRound: [meetings]
          };
        } else {
          acc[groupNumber].meetingsByRound.push(meetings);
        }
      });
      return acc;
    },
    {}
  );

  return (
    <table className={s.root}>
      <thead>
        <th>Группа</th>
        {roundNumbers}
      </thead>
      <tbody>
        {Object.values(groupMeetings).map((group: GroupMeetingsByRound) => {
          return (
            <tr>
              <td>{group.name}</td>
              {group.meetingsByRound.map((i) => (
                <td>
                  <ColoredNumber n={i} />
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
