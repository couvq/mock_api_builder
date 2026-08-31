import { Tab, Tabs } from "@mui/material";

const EndpointViewer = () => {
  return (
    <>
      <Tabs
        value={"Item One"}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <Tab label={`Item ${i}`} />
        ))}
      </Tabs>
    </>
  );
};

export default EndpointViewer;
