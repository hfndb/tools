# Notes

**Preview description** of a project which is currently in the phase of active architecturing and developing. By me, since there can only be one for now.

Notes is a [Node.js](https://en.wikipedia.org/wiki/Node.js) program to do something like making notes in order to retrieve those later. Not in a psyche, in memory, but in a computer. Simple, you might think.

However, not using a known [file format](niceties) or even some [database](https://en.wikipedia.org/wiki/Database) seems a taboo in view of massive infections with the 'having it easy' virus. Within this taboo area, I have used another than customary approach for preserving notes. Which also resulted in other terms, another vocabulary. Translation table:

| Term             | In database terms                                     |
| ---------------- | ----------------------------------------------------- |
| Note             | Record, row                                           |
| Topic            | Set of tables, catalog, schema                        |
| Structure        | Table structure                                       |
| Part             | Field in table                                        |
| Variant          | Data type or table type (lookup or interaction)       |


Yes, I agree. Only using other terms, words, doesn't make a program really different. In which way this program is really different than others, I for now preserve as a mystery 😄


## Variants

|                  | Remarks                                               |
| ---------------- | ----------------------------------------------------- |
| boolean          |                                                       |
| float            |                                                       |
| integer          | Autocrement as default value included                 |
| string           | Unlimited lenght like blog or text in a database      |
| date             | Now and 'last updated' as as default value included   |
| datetime         | Idem dito                                             |
| array            |                                                       |
| object           |                                                       |


## Leading thoughts

While me was leading me, before shaping and structuring this program, I was thinking about imagery, requirements. Leading thoughts became:

+ Reading notes from disk to memory, or writing notes from memory to disk, could have a lower priority than writing from memory to disk.
+ For reading from and writing to disk, the function of a [scribe](https://en.wikipedia.org/wiki/Scribe) (kinda monk) will be used. A 'specialist process' running seperately. For determining file names the function of a 'manager', integrated in the main process.
+ [Vendor lock-in](https://en.wikipedia.org/wiki/Vendor_lock-in) by using a propriety [file format](https://en.wikipedia.org/wiki/Database) should remain taboo.
+ Using [SQL-language](https://en.wikipedia.org/wiki/SQL) should remain taboo too, otherwise this program would 'smell and taste' too much like a database.
+ This program should not only work within one process, but also with multiple processes running. Even in a situation like [distributed computing](https://en.wikipedia.org/wiki/Distributed_computing) in which this program would behave like a [distributed database](https://en.wikipedia.org/wiki/Distributed_database) or [distributed data store](https://en.wikipedia.org/wiki/Distributed_data_store).
+ Generated workload for processor, memory, hard disk, network should not become excessive. Every bit counts and may be too much.
+ In order to minimize reading from disk, standardized reports can be generated, triggered by [cron](https://en.wikipedia.org/wiki/Cron) for a server, or an anarchist version of cron for a workstation, [anacron](https://en.wikipedia.org/wiki/Anacron) or [fcron](https://en.wikipedia.org/wiki/Fcron).
+ Niceties like HTML reports using templates and creating PDF versions of those should remain in queue until 'groundwork' of this program is sufficiently robust, stable.


## Imported files

Some generic files in this program were 'imported' aka copied from another project I created and maintain; [cookware-headless-ice](https://github.com/hfndb/cookware-headless-ice). These files are:
+ src/generic/config.mjs
+ src/generic/log.mjs
+ src/generic/object.mjs
+ src/generic/sys.mjs
+ src/generic/utils.mjs
+ src/generic/store/file-system/dirs.mjs
+ src/generic/store/file-system/files.mjs
+ src/generic/store/file-system/watch.mjs

Via these generic files, dependencies came into this project:
+ [colors](https://www.npmjs.com/package/colors) for colored console output
+ [date-and-time](https://www.npmjs.com/package/date-and-time) to format and manipulate dates and times
+ [fdir](https://www.npmjs.com/package/fdir) to scan directories and files
+ [shelljs](https://www.npmjs.com/package/shelljs) for Linux-like commands, made portable to Windows
