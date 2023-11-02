import { useState, FunctionComponent } from "react";
import type { ProjectInfo } from "../utils/types";
import AblyLogo from "./AblyLogo";
import {
  ArrowTopRightOnSquareIcon,
  ArrowRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";

import styles from "./InfoCard.module.css";
import "../styles/container.css";

const InfoCard: FunctionComponent<{ projectInfo: ProjectInfo }> = ({
  projectInfo,
}) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div>
          <div className={styles.infoTitleWrapper}>
            <h2>{projectInfo.name}</h2>
            <button
              className={styles.infoTitleWrapper}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Less" : "More"} info
              <ChevronUpIcon
                className={`${styles.infoTitleChevron} ${
                  expanded ? styles.infoTitleChevronRotate : ""
                }`}
              />
            </button>
          </div>
        </div>
        {expanded ? (
          <div className={styles.infoExpanded}>
            <div className={styles.infoDescription}>
              {projectInfo.description}
              <div>
                <a
                  className={styles.infoLearnMore}
                  href={`https://ably.com/examples/${projectInfo.topic}?utm_source=ably-labs&utm_medium=demo&utm_campaign=${projectInfo.topic}`}
                  target="_blank"
                >
                  Learn more
                </a>
                .
              </div>
            </div>
            <div className={styles.infoControls}>
              <a
                className={styles.infoControlLight}
                href={window.location.href}
                target="_blank"
              >
                Open in another window
                <ArrowTopRightOnSquareIcon
                  className={styles.infoControlLightIcon}
                />
              </a>
              <a
                className={styles.infoControlDark}
                href={`https://github.com/ably-labs/${projectInfo.repoNameAndPath}`}
              >
                View source on GitHub
                <ArrowTopRightOnSquareIcon
                  className={styles.infoControlDarkIcon}
                />
              </a>
            </div>
          </div>
        ) : null}
      </div>
      <div className={styles.divider} />
      <div className={styles.ably}>
        <AblyLogo />
        <a
          href={`https://ably.com/examples?utm_source=ably-labs&utm_medium=demo&utm_campaign=${projectInfo.topic}`}
          className={styles.viewAllExamples}
        >
          View all examples
          <ArrowRightIcon className={styles.viewAllExamplesIcon} />
        </a>
      </div>
    </div>
  );
};

export default InfoCard;
