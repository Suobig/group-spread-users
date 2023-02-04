import { TMatrix } from "./meetingMatrix";

export type User = {
  id: number;
  name: string;
};
export type TPair = [User, User];

export function getUsers(names: string): User[] {
  if (!names) {
    return [];
  }
  return names.split("\n").map<User>((name, i) => ({
    id: i,
    name
  }));
}

export function getGroupSizes(numUsers: number, numGroups: number): number[] {
  const maxSize = Math.ceil(numUsers / numGroups);
  //start with maximum size
  const groupSizes: number[] = Array(numGroups).fill(maxSize);

  let remainder = maxSize * numGroups - numUsers;

  let i = numGroups - 1;
  while (remainder > 0) {
    groupSizes[i] -= 1;
    i--;
    remainder--;
  }
  return groupSizes;
}

export function getGroups(users: User[], groupSizes: number[]): User[][] {
  let pos = 0;

  const groups: User[][] = [];

  groupSizes.forEach((size) => {
    const group = users.slice(pos, pos + size);
    groups.push(group);
    pos += size;
  });

  return groups;
}

type FirstMetingsByRoundProps = {
  users: User[];
  numRounds: number;
  firstMetPairs: TPair[][];
};

export type UserFirstMeetings = {
  name: string;
  id: number;
  firstMetByRound: number[];
};

export function getUserFirstMeetings(
  props: FirstMetingsByRoundProps
): UserFirstMeetings[] {
  const { users, numRounds, firstMetPairs } = props;

  const firstMeetingsByUser = users.reduce<Record<number, UserFirstMeetings>>(
    (acc, user) => {
      acc[user.id] = {
        name: user.name,
        id: user.id,
        firstMetByRound: Array(numRounds).fill(0)
      };
      return acc;
    },
    {}
  );

  firstMetPairs.forEach((round, roundNumber) => {
    round.forEach((pair) => {
      const [first, second] = pair;
      firstMeetingsByUser[first.id].firstMetByRound[roundNumber] += 1;
      firstMeetingsByUser[second.id].firstMetByRound[roundNumber] += 1;
    });
  });

  return Object.values(firstMeetingsByUser);
}

export function getNeverMetByUser(users: User[], matrix: TMatrix) {
  const neverMetByUser = users.reduce<Record<number, number>>((acc, user) => {
    acc[user.id] = 0;
    return acc;
  }, {});

  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      let timesMet = 0;
      if (users[i].id < users[j].id) {
        timesMet = matrix[users[i].id][users[j].id];
      } else {
        timesMet = matrix[users[j].id][users[i].id];
      }
      if (timesMet === 0) {
        neverMetByUser[users[i].id] += 1;
        neverMetByUser[users[j].id] += 1;
      }
    }
  }
  return neverMetByUser;
}
