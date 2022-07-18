import * as React from "react";
import { HTMLAttributes } from "react";
import { github, footer, disclaimer, githubIcon } from "./footer.css";

export function Footer(props: HTMLAttributes<HTMLElement>): JSX.Element {
  const svgId = "github-link-id";
  return (
    <div className={`${props.className} ${footer}`}>
      <p className={disclaimer}>Belarusians NL 2022</p>
      <a className={github} href="https://github.com/belarusians/website">
        <svg
          aria-labelledby={svgId}
          className={githubIcon}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="32"
          height="32"
          viewBox="0 0 32 32"
        >
          <title id={svgId}>GitHub link</title>
          <path d="M0 15.808q0-3.264 1.28-6.208 2.528-5.952 8.48-8.48 2.944-1.28 6.208-1.28t6.208 1.28q5.888 2.496 8.48 8.48 1.28 3.040 1.28 6.208t-1.28 6.208q-2.592 6.016-8.48 8.544-2.944 1.28-6.208 1.28t-6.208-1.28q-5.952-2.56-8.48-8.544-1.28-2.944-1.28-6.208zM2.496 15.808q0 4.512 2.688 8.064 2.656 3.488 6.944 4.96v-2.56q0-1.92 1.28-2.784-0.64-0.032-1.504-0.224-1.632-0.288-2.784-1.024-2.912-1.76-2.912-6.368 0-2.4 1.6-4.096-0.736-1.888 0.16-4.096h0.64q0.32 0 0.8 0.16 1.248 0.384 2.784 1.408 1.952-0.512 3.84-0.512t3.872 0.512q1.248-0.832 2.336-1.28 1.024-0.384 1.472-0.32l0.384 0.032q0.864 2.208 0.16 4.096 1.6 1.696 1.6 4.096 0 3.584-1.76 5.408-0.96 1.024-2.528 1.6-1.312 0.48-2.912 0.608 1.312 0.928 1.312 2.784v2.56q4.128-1.472 6.816-5.024 2.624-3.52 2.624-8 0-2.72-1.056-5.248-1.024-2.432-2.88-4.288-1.792-1.792-4.288-2.848-2.56-1.088-5.216-1.088-2.624 0-5.248 1.088-2.4 1.024-4.288 2.848-1.792 1.856-2.88 4.288-1.056 2.528-1.056 5.248z" />
        </svg>
      </a>
    </div>
  );
}
