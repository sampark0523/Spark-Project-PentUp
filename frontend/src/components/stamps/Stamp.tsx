import * as React from "react";
import { Box } from "@mui/material";
import Image from "next/image";

interface StampProps {
	color: string;
	mascotImage?: string | null;
}

export function Stamp({ color, mascotImage }: StampProps) {
	return (
		<Box
			sx={{
				position: "relative",
				width: 44,
				height: 44,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				borderRadius: "6px",
				backgroundColor: color,
				overflow: "hidden",
			}}
		>
			{mascotImage ? (
				// Display the mascot image
				<Image
					src={mascotImage}
					alt="Mascot"
					width={36}
					height={36}
					style={{
						objectFit: "contain",
						position: "relative",
						zIndex: 1,
					}}
				/>
			) : (
				// Fallback to stamp icon if no mascot
				<svg
					width="28"
					height="22"
					viewBox="0 0 77 62"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					style={{
						position: "relative",
						zIndex: 1,
					}}
				>
					<path
						d="M72.8167 57.4792H61.3008V61.3011H76.6386V42.1414H72.8167V57.4792Z"
						fill="white"
					/>
					<path d="M72.8164 22.9817H76.6383V34.4976H72.8164V22.9817Z" fill="white" />
					<path
						d="M72.8167 15.3378H76.6386V0H61.3008V3.82189H72.8167V15.3378Z"
						fill="white"
					/>
					<path d="M68.9688 34.4976H72.8158V42.1413H68.9688V34.4976Z" fill="white" />
					<path d="M68.9688 15.3378H72.8158V22.9815H68.9688V15.3378Z" fill="white" />
					<path d="M53.6562 53.632H61.3V57.479H53.6562V53.632Z" fill="white" />
					<path
						d="M65.1495 11.4907H11.4922V49.8102H65.1495V11.4907ZM42.1679 45.9883H15.3392V38.3194H19.1611V34.4975H23.0081V30.6505H30.6519V34.4975H34.4989V38.3194H38.3208V42.1413H42.1679V45.9883ZM42.1679 19.1596H45.9898V15.3378H53.6587V19.1596H57.4806V26.8286H53.6587V30.6505H45.9898V26.8286H42.1679V19.1596ZM61.3025 45.9883H45.9898V42.1413H49.8116V38.3194H53.6587V34.4975H61.3025V45.9883Z"
						fill="white"
					/>
					<path d="M53.6562 3.8219H61.3V7.66893H53.6562V3.8219Z" fill="white" />
					<path d="M42.166 57.4791H53.6568V61.301H42.166V57.4791Z" fill="white" />
					<path d="M42.166 0H53.6568V3.82189H42.166V0Z" fill="white" />
					<path d="M34.4961 53.632H42.165V57.479H34.4961V53.632Z" fill="white" />
					<path d="M34.4961 3.8219H42.165V7.66893H34.4961V3.8219Z" fill="white" />
					<path d="M23.0078 57.4791H34.4986V61.301H23.0078V57.4791Z" fill="white" />
					<path d="M23.0078 0H34.4986V3.82189H23.0078V0Z" fill="white" />
					<path d="M15.3359 53.632H23.0049V57.479H15.3359V53.632Z" fill="white" />
					<path d="M15.3359 3.8219H23.0049V7.66893H15.3359V3.8219Z" fill="white" />
					<path
						d="M15.3378 57.4792H3.84703V42.1414H0V61.3011H15.3378V57.4792Z"
						fill="white"
					/>
					<path d="M3.84766 34.4976H7.66954V42.1413H3.84766V34.4976Z" fill="white" />
					<path d="M3.84766 15.3378H7.66954V22.9815H3.84766V15.3378Z" fill="white" />
					<path d="M0 22.9817H3.84703V34.4976H0V22.9817Z" fill="white" />
					<path
						d="M3.84703 3.82189H15.3378V0H0V15.3378H3.84703V3.82189Z"
						fill="white"
					/>
				</svg>
			)}
		</Box>
	);
}
