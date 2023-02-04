import _ from "lodash";

import { getGroups, User } from "./users";
import { getQualityDiff, getUpdatedMatrix, TMatrix } from "./meetingMatrix";
import { initMeetingMatrix } from "./meetingMatrix";
import { getGroupSizes, TPair } from "./users";

export type Round = User[][];

export type RoundResult = {
  groups: User[][];
  meetingMatrix: TMatrix;
};

export function getFirstRoundResults(
  users: User[],
  groupSizes: number[],
  meetingMatrix: TMatrix
) {
  const groups = getGroups(users, groupSizes);
  const { newMatrix, firstMetPairs } = getUpdatedMatrix(groups, meetingMatrix);

  return { groups, meetingMatrix: newMatrix, firstMetPairs };
}

type Result = {
  qualityDiff: number | null;
  groups: User[][] | null;
};

type RetrunValue = Result & { matrix: TMatrix; firstMetPairs: TPair[] };

export function getRoundResults(
  users: User[],
  groupSizes: number[],
  meetingMatrix: TMatrix,
  numTries: number
): RetrunValue {
  const bestResult: Result = {
    qualityDiff: null,
    groups: null,
  };
  for (let i = 1; i < numTries; i++) {
    const shuffledUsers = _.shuffle(users);
    const groups = getGroups(shuffledUsers, groupSizes);
    const qualityDiff = getQualityDiff(groups, meetingMatrix);
    if (
      bestResult.qualityDiff === null ||
      qualityDiff < bestResult.qualityDiff
    ) {
      bestResult.qualityDiff = qualityDiff;
      bestResult.groups = groups;
    }
  }
  const { newMatrix: bestResultMatrix, firstMetPairs } = getUpdatedMatrix(
    bestResult.groups!,
    meetingMatrix
  );
  return {
    ...bestResult,
    matrix: bestResultMatrix,
    firstMetPairs,
  };
}

export function getRounds(
  users: User[],
  numGroups: number,
  numRounds: number,
  numTries: number
) {
  let meetingMatrix = initMeetingMatrix(users.length);
  const groupSizes = getGroupSizes(users.length, numGroups);

  const firstRoundResults = getFirstRoundResults(
    users,
    groupSizes,
    meetingMatrix
  );

  meetingMatrix = firstRoundResults.meetingMatrix;
  const allFirstMetPairs = [firstRoundResults.firstMetPairs];
  const rounds = [firstRoundResults.groups];
  for (let i = 1; i < numRounds; i++) {
    const nextRoundResults = getRoundResults(
      users,
      groupSizes,
      meetingMatrix,
      numTries
    );
    meetingMatrix = nextRoundResults.matrix;
    allFirstMetPairs.push(nextRoundResults.firstMetPairs);
    rounds.push(nextRoundResults.groups!);
  }

  return { rounds, meetingMatrix, allFirstMetPairs };
}
