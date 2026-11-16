import { useId } from 'react';

export interface LogoKAIProps {
	className?: string;
	variant?: 'login' | 'header';
}

export const LogoKAI = ({ className, variant = 'login' }: LogoKAIProps) => {
	const uid = useId().replace(/:/g, '');
	const lensGradId = `${uid}-lens-grad`;
	const logoClipId = `${uid}-logo-clip`;
	const wrapClassName =
		variant === 'header'
			? `itsa-logo-kai-wrap itsa-logo-kai-wrap--header ${className ?? ''}`
			: `itsa-logo-kai-wrap ${className ?? ''}`;

	return (
		<div className={wrapClassName}>
			<svg viewBox="222 196 708 232" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Logo KAI">
				<defs>
					<linearGradient id={lensGradId} x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="white" stopOpacity={0} />
						<stop offset="36%" stopColor="white" stopOpacity={0.05} />
						<stop offset="50%" stopColor="white" stopOpacity={0.15} />
						<stop offset="64%" stopColor="white" stopOpacity={0.05} />
						<stop offset="100%" stopColor="white" stopOpacity={0} />
					</linearGradient>
					<clipPath id={logoClipId}>
						<rect x="222" y="196" width="708" height="232" />
					</clipPath>
				</defs>

				<path
					className="itsa-logo-kai-diamond-outer"
					d="M264.066 205C264.879 205.004 265.895 205.081 266.643 205.419C268.879 206.429 330.774 269.694 331.596 272.201C331.984 273.387 331.551 275.48 330.923 276.505C327.918 281.404 310.676 297.461 305.292 302.871L282.456 325.85C278.412 329.913 270.231 339.391 265.187 340.679C259.83 339.456 248.26 326.411 244 321.862C258.297 306.63 276.779 289.559 291.892 274.343C281.816 262.99 268.998 251.648 258.524 240.505C255.077 236.837 246.57 229.2 244.368 225.132C245.039 222.359 261.074 207.078 264.066 205Z"
					fill="#D3171C"
				/>

				<path
					className="itsa-logo-kai-diamond-inner"
					d="M343.451 282.66L343.65 282.668C349.44 282.889 361.475 297.109 365.607 301.8C361.628 306.554 353.641 314.07 349.04 318.652L318.331 349.363L348.321 379.32C353.659 384.646 360.81 391.394 365.681 396.984C363.431 399.997 349.502 413.757 346.275 415.807C343.164 415.917 342.23 415.958 339.929 413.666C320.753 394.565 301.488 375.525 282.483 356.258C281.428 355.189 277.73 350.482 278.291 349.051C279.126 346.921 281.069 344.261 282.732 342.546C291.916 333.077 301.438 323.889 310.705 314.495C316.761 308.682 338.272 285.73 343.451 282.66Z"
					fill="#1F1E1E"
				/>

				<path
					className="itsa-logo-kai-bar-left"
					d="M423.852 221.776L470.76 221.739L470.781 357.619C464.645 363.674 455.431 371.304 448.742 377.139L423.834 399.233L423.852 221.776Z"
					fill="#D3171C"
				/>

				<path
					className="itsa-logo-kai-k-arms"
					d="M564.148 221.758L635.714 221.753C627.519 229.338 612.889 240.523 603.834 247.857L543.498 296.589L538.813 300.225L475.149 300.18C497.86 279.368 521.56 259.55 544.406 238.871C550.295 233.54 557.85 226.251 564.148 221.758Z"
					fill="#D3171C"
				/>

				<path
					className="itsa-logo-kai-main-body"
					d="M740.159 219.447C741.269 220.168 768.644 259.884 771.694 264.286C801.394 307.18 832.644 348.819 863.094 391.152L815.06 391.207C804.855 377.357 794.544 362.258 784.569 348.136C769.589 327.164 754.759 306.082 740.084 284.893C714.574 319.765 689.434 356.026 664.349 391.217L629.599 391.219L565.564 391.194L510.694 340.773C499.972 330.993 488.004 320.522 477.741 310.421C496.092 311.175 520.255 310.638 538.814 310.394C565.819 335.47 592.98 361.852 619.69 387.305C623.565 382.556 629.13 374.331 632.859 369.16L657.685 334.848L740.159 219.447Z"
					fill="#1F1E1E"
				/>

				<path
					className="itsa-logo-kai-bar-right"
					d="M873.974 221.704L911.709 221.749C912.394 277.552 911.839 335.289 911.699 391.185L874.019 391.204C873.404 373.433 873.969 352.111 873.969 334.114L873.974 221.704Z"
					fill="#1F1E1E"
				/>

				<g clipPath={`url(#${logoClipId})`}>
					<rect
						className="itsa-logo-kai-lens-sweep"
						x="222"
						y="196"
						width="708"
						height="232"
						fill={`url(#${lensGradId})`}
					/>
				</g>
			</svg>
		</div>
	);
};
