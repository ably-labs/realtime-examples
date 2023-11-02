import { FunctionComponent, useEffect, useState } from "react";
import {
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  CodeBracketIcon,
  ArrowRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import debounce from "lodash.debounce";

import type { ProjectInfo } from "../utils/types";
import AblyLogo from "./AblyLogo";
import GitHubLogo from "./GitHubLogo";

import styles from "./SpacesInfoCard.module.css";
import "../styles/container.css";

const ExpandedInfoSection: FunctionComponent<{ projectInfo: ProjectInfo }> = ({
  projectInfo,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyClick = async () => {
    const currentURL = window.location.href;
    try {
      await navigator.clipboard.writeText(currentURL);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (err) {
      console.error("Failed to copy URL: ", err);
    }
  };

  return (
    <div>
      <div className={styles.descriptionWrapper}>
        {projectInfo.description}
        {projectInfo.learnMore ? (
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
        ) : null}
      </div>
      <div className={styles.infoControls}>
        <a
          className={styles.infoControlLight}
          href={window.location.href}
          target="_blank"
        >
          Open in new window
          <ArrowTopRightOnSquareIcon className={styles.infoControlOrangeIcon} />
        </a>
        <div className={styles.infoControlCollapse}>
          <button className={styles.infoControlDark} onClick={handleCopyClick}>
            <DocumentDuplicateIcon className={styles.infoControlDarkIcon} />
            {isCopied ? "Copied!" : "Copy Link"}
          </button>
          <a className={styles.infoControlDark} href={projectInfo.docsLink}>
            <CodeBracketIcon
              className={styles.infoControlDarkIconCodeBracket}
            />
            View docs
            <ArrowTopRightOnSquareIcon className={styles.infoControlDarkIcon} />
          </a>
        </div>
        <a
          className={styles.infoControlDark}
          href={`https://github.com/ably-labs/${projectInfo.repoNameAndPath}`}
        >
          <span className={styles.infoControlGithubLogo}>
            <GitHubLogo />
          </span>
          <span className={styles.infoControlViewControls}>
            View source on GitHub
          </span>
          <ArrowTopRightOnSquareIcon className={styles.infoControlDarkIcon} />
        </a>
      </div>
    </div>
  );
};

const SpacesInfoCard: FunctionComponent<{ projectInfo: ProjectInfo }> = ({
  projectInfo,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);

  useEffect(() => {
    const handleResize = debounce(() => {
      setIsMobile(window.innerWidth < 768);
    }, 150);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div>
          <div className={styles.cardTopWrapper}>
            <h2 className={styles.cardTitle}>{projectInfo.name}</h2>
            {isMobile ? (
              <button
                className={styles.cardTitleBtn}
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Less" : "More"} info
                <ChevronUpIcon
                  className={`${styles.cardTitleBtnIcon} ${
                    expanded ? styles.cardTitleBtnIconRotate : ""
                  }`}
                />
              </button>
            ) : null}
          </div>
        </div>
        <div className={expanded ? styles.expandedSectionWrapper : ""}>
          {expanded || !isMobile ? (
            <ExpandedInfoSection projectInfo={projectInfo} />
          ) : null}
        </div>
      </div>
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

export default SpacesInfoCard;
