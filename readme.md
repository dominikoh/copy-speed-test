# Prerequisites
For parallel testing, you will need to install the [GNU parallel](https://www.gnu.org/software/parallel/sphinx.html) utility. On a Mac, you can do this with homebrew:
```
brew install parallel
```

## create sample data files
```
mkdir data
cd data
```

To create a set of 1000 files, each 24MB in size, you can run the following command:
```
for i in {1..1000}; do dd if=/dev/urandom bs=24M count=1 of=file$i; done >/dev/null 2>&1
```

# copy-speed-test

 > A utility to compare different nodejs file copy strategies

 ## Usage

 ```
 npx copy-speed-test -s someFile.zip -d someNonExistentFolder
 ```

 ## Run from build

 ```
 npm run build
 npm run start -- -s someFile.zip -d someNonExistentFolder
 ```

[//]: ####ts-command-line-args_write-markdown_replaceBelow

## Options

| Argument | Alias | Type | Description |
|-|-|-|-|
| **destinationFolder** | **d** | string | A folder to copy to. The folder should not exist. It will be deleted after the tests complete |
| **sourceFile** | **s** | string | The file to copy |
| **force** | **f** | boolean | Will delete the destination folder before starting if it exists. |
| **testsInSet** | | number | The number of times to run each test. Defaults to 3. |
| **highWaterMark** | | string[] | An Array of highwatermark values to run the createReadStream test at. Defaults to ['1 MB', '100.0 MB', '500.00 MB', '1.000 GB']. Set multiple values as follows: '--highWaterMark="50 kB,150 MB,1 GB"' |
| **help** | **h** | boolean | Shows this help guide |

[//]: ####ts-command-line-args_write-markdown_replaceAbove

## Sample Output

![image](https://user-images.githubusercontent.com/10414642/114300264-4ad38180-9ab7-11eb-8679-eb7ae3333ce0.png)

