import React, { FC } from "react";
import cn from "classnames";

import { TMatrix } from "./utils/meetingMatrix";
import s from "./ColorMatrix.module.sass";

function getClassName(value: number) {
  if (value === 0) {
    return cn(s.block, s.white);
  }

  if (value === 1) {
    return cn(s.block, s.green);
  }

  if (value === 2) {
    return cn(s.block, s.yellow);
  }

  if (value === 3) {
    return cn(s.block, s.orange);
  }

  return cn(s.block, s.red);
}

const ColorBlock: FC<{ value: number }> = (props) => {
  const { value } = props;

  const className = getClassName(value);

  return <td className={className}>{value}</td>;
};

export const ColorMatrix: FC<{ matrix: TMatrix }> = (props) => {
  const { matrix } = props;

  return (
    <table className={s.root}>
      <tbody>
        {matrix.map((row) => (
          <tr>
            {row.map((el) => (
              <ColorBlock value={el} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
