import {Meta} from "@storybook/react";
import * as React from "react";
import Button from "./Button"

export default {
    title: "Components/Interactable/Button",
    component: Button
} as Meta

export const Default = (args:any) => <Button {...args}>Button</Button>
