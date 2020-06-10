import {
  Container,
  Paper,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import React from "react";
import { useSelector } from "react-redux";

import Carousel from "../../components/carousel/carousel";
import withLayout from "../app/withLayout";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(3),
    },
    info: {
      padding: theme.spacing(2),
    },
  };
});

const Gallery = (props) => {
  const { data } = props;

  const classes = useStyles();

  const baseContentURL = useSelector((state) => {
    return state.app.baseContentURL;
  });

  const theme = useTheme();

  const isXS = useMediaQuery(theme.breakpoints.down("xs"), { noSsr: true });

  const alt = `${data.brand} ${data.project}`;

  const slides = data.view.stills.map((obj, i) => {
    const url = `${baseContentURL}img/gallery/${obj}`;
    return <img src={url} alt={`${alt} ${i}`} key={obj} />;
  });

  // safelySetInnerHTML :)
  const info = parse(DOMPurify.sanitize(data.info));

  return (
    <Container className={classes.root} style={{ maxWidth: data.view.width }}>
      <Carousel slides={slides} />
      <Paper className={classes.info}>
        <Typography
          variant={isXS ? "body2" : "body1"}
          gutterBottom
          component="div"
        >
          {/* INFO */}
          {info}
        </Typography>
      </Paper>
    </Container>
  );
};

export default withLayout(Gallery);
