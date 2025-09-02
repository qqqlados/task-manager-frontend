'use client'

import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

interface TitleProps {
	text: string
	className?: string
}

export const Title: FC<TitleProps> = ({ text, className }) => {
	return <h1 className={twMerge(className)}>{text}</h1>
}
