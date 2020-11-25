import TextInput, {TextInputProps} from "./TextInput";
import {Meta} from "@storybook/react";
import * as React from "react";

export default {
    title: "Components/Input/TextInput",
    component: TextInput
} as Meta

export const Text = (args: any) => <TextInput {...args}/>

export const NotEmpty = (args: any) => <TextInput  {...args}/>
NotEmpty.args = {notEmpty: true}

export const UsernameExample = (args: any) => <TextInput {...args}/>
UsernameExample.args = {notEmpty: true, placeholder: "Username", autoComplete: "username", mode: "text"} as TextInputProps

export const EmailExample = (args: any) => <TextInput {...args}/>
EmailExample.args = {notEmpty: true, placeholder: "Email", autoComplete: "email", mode: "email", errorLabel: true} as TextInputProps
