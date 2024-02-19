import { Button } from "@chakra-ui/react"

interface OptionsButtonProps {
    studyMode: string;
}

export const OptionsButton = () => {
    return (
        <Button variant="outline" className="ml-auto w-20 rounded-lg">
            Options
        </Button>
    )
}