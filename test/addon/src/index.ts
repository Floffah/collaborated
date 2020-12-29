import "source-map-support/register";
import TestAddon from "./addon/TestAddon";

const addon = new TestAddon();
addon.init();
