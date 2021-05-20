import Service from "../service/Service";

export function serviceCmd() {
    const service = new Service();
    service.start();
}
