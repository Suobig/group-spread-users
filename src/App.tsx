import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  createTheme,
  CssBaseline,
  Snackbar,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import _ from "lodash";

import {
  getNeverMetByUser,
  getUserFirstMeetings,
  getUsers,
  User,
  UserFirstMeetings,
} from "./utils/users";
import { getMatrixQuality, TMatrix } from "./utils/meetingMatrix";
import { getRounds } from "./utils/rounds";
import { Form } from "./Form/Form";
import { RoundsTable } from ".//RoundsTable/RoundsTable";
import { ColorMatrix } from "./ColorMatrix/ColorMatrix";
import { FirstMeetings } from "./FirstMeetings/FirstMeetings";
import { FirstMeetingsGroup } from "./FirstMeetingsGroup/FirstMeetingsGroup";
import s from "./App.module.sass";

type Round = User[][];

export default function App() {
  const [rounds, setRounds] = useState<Round[]>();
  const [matrix, setMatrix] = useState<TMatrix>();
  const [bestHeuristic, setBestHeuristic] = useState(1e9);
  const [formState, setFormState] = useState<any>();
  const [firstMeetings, setFirstMeetings] = useState<UserFirstMeetings[]>();
  const [neverMetByUser, setNeverMetByUser] = useState<Record<number, number>>(
    {}
  );
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (e: any) => {
      const {
        users: userNames,
        numGroups: rawNumGroups,
        numRounds: rawNumRounds,
      } = e;
      //reset if form changed
      const currentBestHeuristic = _.isEqual(formState, e)
        ? bestHeuristic
        : 1e19;

      setFormState(e);

      const users = getUsers(userNames);

      console.log("users", users);
      const numGroups = rawNumGroups ? parseInt(rawNumGroups, 10) : 0;
      const numRounds = rawNumRounds ? parseInt(rawNumRounds, 10) : 0;

      const {
        rounds: resultRounds,
        meetingMatrix: resultMatrix,
        allFirstMetPairs,
      } = getRounds(users, numGroups, numRounds, 1e6);

      const heuristic = getMatrixQuality(resultMatrix);

      if (heuristic <= currentBestHeuristic) {
        const userFirstMeetings = getUserFirstMeetings({
          users,
          numRounds,
          firstMetPairs: allFirstMetPairs,
        });
        console.log(userFirstMeetings);
        setFirstMeetings(userFirstMeetings);
        setNeverMetByUser(getNeverMetByUser(users, resultMatrix));
        setBestHeuristic(heuristic);
        setRounds(resultRounds);
        setMatrix(resultMatrix);
      }
    },
    [bestHeuristic, formState]
  );

  const handleClose = useCallback(
    (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }

      setOpen(false);
    },
    []
  );

  const handleCopy = useCallback(() => {
    const elTable = document.querySelector("#rounds_table");

    let range, sel;

    // Ensure that range and selection are supported by the browsers
    if (document.createRange && window.getSelection) {
      range = document.createRange();
      sel = window.getSelection();
      if (!sel || !elTable) return;
      // unselect any element in the page
      sel.removeAllRanges();

      try {
        range.selectNodeContents(elTable);
        sel.addRange(range);
      } catch (e) {
        range.selectNode(elTable);
        sel.addRange(range);
      }

      document.execCommand("copy");
      sel.removeAllRanges();
      setOpen(true);
    }

    console.log("Element Copied! Paste it in a file");
  }, []);

  const theme = createTheme();

  return (
    <div className={s.root}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Typography component="h1" variant="h4" align="center">
          Распределение участников по группам
        </Typography>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Таблица скопирована в буфер обена
          </Alert>
        </Snackbar>
        <Form onSubmit={handleSubmit} />
        {matrix && (
          <div className={s.heuristic}>
            Эвристика (меньше - лучше): {getMatrixQuality(matrix)}
            {rounds && firstMeetings && (
              <FirstMeetingsGroup rounds={rounds} meetings={firstMeetings} />
            )}
          </div>
        )}
        <div style={{ display: "flex" }}>
          {matrix && <ColorMatrix matrix={matrix} />}
          {firstMeetings && (
            <FirstMeetings
              meetings={firstMeetings}
              neverMetByUser={neverMetByUser}
            />
          )}
        </div>

        {rounds && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              padding: "10px 0 0 30px",
              borderTop: "1px solid gray",
            }}
          >
            <RoundsTable rounds={rounds} />
            <Tooltip title="copy">
              <Button
                sx={{ height: "50px" }}
                // size="large"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopy}
              ></Button>
            </Tooltip>
          </div>
        )}
      </ThemeProvider>
    </div>
  );
}
