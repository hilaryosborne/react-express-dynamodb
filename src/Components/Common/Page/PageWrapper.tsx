import React, { useContext } from "react";
import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";

type Props = {
  title: string;
  children: any;
  className?: string;
  classes?: {
    contents?: string;
  };
};
type Classes = {
  root: string;
};
const useStyles = makeStyles<Classes>({
  root: {},
});

const PageWrapper = ({ title, children, className }: Props) => {
  const classes = useStyles();
  return (
    <div className={classnames(classes.root, className)}>
      <Helmet>
        <title>{title || "Hi"}</title>
      </Helmet>
      <div className={classnames(classes?.contents)}>{children}</div>
    </div>
  );
};

export default PageWrapper;
