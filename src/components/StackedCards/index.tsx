import React from "react"
import { StackedCardData } from '@/interfaces';
import { useEffect, useRef, useState } from "react"
import { CloseOutlined } from "@ant-design/icons"
import { Button } from "../Button"

export interface IStackedCardsProps {
	cards: StackedCardData[]
	emptyMessage?: string;
	className?: string;
	maxVisible?: number;
	/** px de separación vertical entre cards */
	stackOffsetY?: number;
	/** ancho máximo del stack (px o string css) */
	maxWidth?: number | string;
	/** ancho del stack (px o string css) */
	width?: number | string;
	/** alto mínimo cuando está vacío (px o string css) */
	emptyMinHeight?: number | string;
}

function cssSize(value: number | string | undefined) {
	if (value === undefined) return undefined;
	return typeof value === 'number' ? `${value}px` : value;
}

export const StackedCards = (props: IStackedCardsProps) => {
	const {
		cards,
		emptyMessage,
		className,
		maxVisible = 3,
		stackOffsetY = 10,
		maxWidth = 340,
		width,
		emptyMinHeight = 144,
	} = props
	const [currentIndex, setCurrentIndex] = useState(0)

	const cardsRef = useRef(cards)
	const currentIndexRef = useRef(currentIndex)
	const activeCardRef = useRef<HTMLDivElement | null>(null)
	const [activeCardHeight, setActiveCardHeight] = useState<number>(0)

	useEffect(() => {
		cardsRef.current = cards
	}, [cards])

	useEffect(() => {
		currentIndexRef.current = currentIndex
	}, [currentIndex])

	// Measure active card height so the container can reserve space (absolute children don't affect layout height)
	useEffect(() => {
		const el = activeCardRef.current
		if (!el) return

		const measure = () => {
			const rect = el.getBoundingClientRect()
			setActiveCardHeight(Math.ceil(rect.height))
		}

		measure()

		if (typeof ResizeObserver !== "undefined") {
			const ro = new ResizeObserver(() => measure())
			ro.observe(el)
			return () => ro.disconnect()
		}

		// Fallback: re-measure on next frame
		const raf = window.requestAnimationFrame(measure)
		return () => window.cancelAnimationFrame(raf)
	}, [cards.length, currentIndex])

	// Clamp index when cards length changes
	useEffect(() => {
		setCurrentIndex(prev => {
			const max = Math.max(0, cards.length - 1)
			return Math.min(prev, max)
		})
	}, [cards.length])

	// Keyboard navigation: ArrowUp/ArrowDown + Enter to execute onButtonClick
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null
			const isTypingTarget =
				!!target &&
				(target.tagName === "INPUT" ||
					target.tagName === "TEXTAREA" ||
					target.tagName === "SELECT" ||
					target.isContentEditable)

			if (isTypingTarget) return

			const list = cardsRef.current
			const len = list.length
			if (len === 0) return

			if (e.key === "ArrowDown") {
				e.preventDefault()
				setCurrentIndex(i => (i < len - 1 ? i + 1 : i))
				return
			}

			if (e.key === "ArrowUp") {
				e.preventDefault()
				setCurrentIndex(i => (i > 0 ? i - 1 : i))
				return
			}

			if (e.key === "Enter") {
				const active = list[currentIndexRef.current]
				active?.onButtonClick?.()
			}
		}

		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [])



	const handleDelete = (card: StackedCardData) => {
		card.onRemoveClick?.()
	}

	const handleScroll = (e: React.WheelEvent) => {
		e.preventDefault()
		if (e.deltaY > 0 && currentIndex < cards.length - 1) {
			setCurrentIndex(currentIndex + 1)
		} else if (e.deltaY < 0 && currentIndex > 0) {
			setCurrentIndex(currentIndex - 1)
		}
	}

	const visibleCount = Math.min(maxVisible, cards.length)
	const stackLift = Math.max(0, visibleCount - 1) * stackOffsetY
	const reservedHeight = activeCardHeight > 0 ? activeCardHeight + stackLift : undefined

	return (
		<div
			className={`relative w-full ${className ?? ""}`}
			style={{
				maxWidth: cssSize(maxWidth),
				width: cssSize(width),
				height: reservedHeight ? `${reservedHeight}px` : undefined,
				minHeight: cards.length === 0 ? cssSize(emptyMinHeight) : undefined,
			}}
			onWheel={handleScroll}
		>
			{cards.length === 0 ? (
				<div className="flex h-full items-center justify-center rounded-xl border border-gray-100 bg-gray-100 text-sm text-gray-400">
					{emptyMessage ?? 'No hay documentos cargados'}
				</div>
			) : (
				cards.map((card, index) => {
					const offset = index - currentIndex
					const isVisible = offset >= 0 && offset < maxVisible

					if (!isVisible) return null

					return (
						<div
							key={card.id}
							ref={offset === 0 ? activeCardRef : undefined}
							className="absolute inset-x-0 bottom-0 rounded-xl bg-gray-250 border border-gray-300 shadow-sm p-2 transition-all duration-200"
							style={{
								transform: `translateY(${offset * -stackOffsetY}px) scale(${1 - offset * 0.03})`,
								zIndex: cards.length - offset,
								opacity: offset === 0 ? 1 : 0.7,
							}}
						>
							<div className="flex items-start justify-between gap-0">
								<div className="flex items-center gap-1">
									<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-medium text-gray-600">
										{card.id}
									</span>
									<small className="text-sm font-medium text-gray-900">
										{card.title}
									</small>
								</div>
								<div className="flex items-center gap-1">
									<Button size="small" type="secondary" 
									label={card.buttonTitle} onClick={card.onButtonClick} allowEnterKey={true} />
									<Button
										onClick={() => handleDelete(card)}
										size="small"
										type="text"
										label={<CloseOutlined />}
									/>
								</div>
							</div>
							{card.content}
						</div>
					)
				})
			)}
		</div>
	)
}
