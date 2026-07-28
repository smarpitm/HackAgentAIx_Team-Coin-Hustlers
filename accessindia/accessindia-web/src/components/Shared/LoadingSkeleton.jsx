import React from 'react'

export function LoadingSkeleton({ className = '', variant = 'default' }) {
  const baseClasses = 'skeleton animate-pulse'
  
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-6 w-1/2',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-32 w-full rounded-xl',
    button: 'h-10 w-24 rounded-lg',
    image: 'h-48 w-full rounded-xl',
  }

  return (
    <div className={`${baseClasses} ${variants[variant] || variants.default} ${className}`} />
  )
}

export function CardSkeleton() {
  return (
    <div className="agent-card p-4 md:p-5 space-y-4">
      <div className="flex items-center gap-3">
        <LoadingSkeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton variant="title" />
          <LoadingSkeleton variant="text" />
        </div>
      </div>
      <LoadingSkeleton variant="card" />
      <div className="space-y-2">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="text" className="w-1/2" />
      </div>
    </div>
  )
}

export function ChatSkeleton() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0">
        <LoadingSkeleton variant="avatar" />
      </div>
      <div className="flex-1 space-y-2">
        <LoadingSkeleton variant="title" className="w-32" />
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="text" className="w-2/3" />
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <LoadingSkeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton variant="text" />
            <LoadingSkeleton variant="text" className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
