import { motion } from "motion/react"

const Avatar = () => {
  return (
    <div className="h-auto w-[40px]">
      <img
        src={"https://api.dicebear.com/10.x/bottts-neutral/svg?seed=7jt3bo28"}
        alt="phong phan"
        className="h-auto w-full overflow-hidden rounded-full object-cover"
      />
    </div>
  )
}

export const SkeletonHover = ({
  text1,
  text2,
}: {
  text1: string
  text2: string
}) => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  }
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex min-h-24 w-full flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="grid grid-cols-12 items-start gap-2 space-x-2 rounded-2xl border border-neutral-500 bg-accent p-2 dark:border-white/20 dark:bg-black"
      >
        <div className="col-span-2">
          <Avatar />
        </div>
        <p className="col-span-10 pl-3 text-xs dark:text-white">{text1}</p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="ml-auto flex w-3/4 flex-row items-center justify-end space-x-2 rounded-full border border-neutral-500 bg-accent p-2 dark:border-white/20 dark:bg-black"
      >
        <p className="px-2 text-xs uppercase dark:text-white"> {text2}</p>
        <div className="h-6 w-6 shrink-0 rounded-full bg-linear-to-r from-pink-500 to-violet-500" />
      </motion.div>
    </motion.div>
  )
}

export const SkeletonTwo = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  }
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative z-50 flex w-full flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row items-center space-x-2 rounded-full border border-neutral-100 bg-black p-1 2xl:p-2 dark:border-white/20 dark:bg-black"
      >
        <div className="h-4 w-4 shrink-0 rounded-full bg-linear-to-r from-pink-500 to-violet-500 lg:h-6 lg:w-6" />
        <div className="bg-color-4 h-3 w-full rounded-full md:h-4" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="ml-auto flex w-3/4 flex-row items-center space-x-2 rounded-full border border-neutral-100 bg-black p-2 dark:border-white/20 dark:bg-black"
      >
        <div className="bg-color-4 h-3 w-full rounded-full md:h-4" />
        <div className="h-4 w-4 shrink-0 rounded-full bg-linear-to-r from-pink-500 to-violet-500 lg:h-6 lg:w-6" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row items-center space-x-2 rounded-full border border-neutral-100 bg-black p-2 dark:border-white/20 dark:bg-black"
      >
        <div className="h-4 w-4 shrink-0 rounded-full bg-linear-to-r from-pink-500 to-violet-500 lg:h-6 lg:w-6" />
        <div className="bg-color-4 h-3 w-full rounded-full md:h-4" />
      </motion.div>
    </motion.div>
  )
}
