# Ecosystem

## Components

* [cli](../packages/cli)
* [scanner](../packages/scanner)
* [ui](../packages/ui)

```mermaid
graph TD

config.json[/config.json/]
noodleDist[/noodleDist/]
Repos[/Local Repositories/]
noodleScanOutput.json[/noodleScanOutput.json/]
Credentials[/Credentials/]
Login([Login GitHub])
Clone([Clone Repositories])
Scan([Scan])
bundle([bundle])
scan([scan])
TypeEvaluation([Type Evaluation])
Save([Save])
ScanResults[/Scan Results/]

bundle -->|output| noodleDist
CLI --> bundle --> UI -.-> noodleScanOutput.json
noodleScanOutput.json --> bundle
CLI --> scan --> Scanner
config.json --> scan
Scanner --> Login --> Credentials
Scanner & Credentials --> Clone --> Repos
Scanner & Repos --> Scan --> TypeEvaluation & ScanResults
scan & ScanResults --> Save --> noodleScanOutput.json
Scanner & noodleScanOutput.json
```
