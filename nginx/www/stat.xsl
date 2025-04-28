<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="text" encoding="UTF-8" />

    <xsl:template match="/">
        {
            "rtmp": {
                "nginx_version": "<xsl:value-of select='/rtmp/nginx_version'/>",
                "nginx_rtmp_version": "<xsl:value-of select='/rtmp/nginx_rtmp_version'/>",
                "pid": "<xsl:value-of select='/rtmp/pid'/>",
                "uptime": "<xsl:value-of select='/rtmp/uptime'/>",
                "naccepted": "<xsl:value-of select='/rtmp/naccepted'/>",
                "applications": [
                    <xsl:for-each select="/rtmp/server/application">
                        {
                            "name": "<xsl:value-of select='name'/>",
                            "live": {
                                "nclients": "<xsl:value-of select='live/nclients'/>",
                                "streams": [
                                    <xsl:for-each select="live/stream">
                                        {
                                            "name": "<xsl:value-of select='name'/>",
                                            "nclients": "<xsl:value-of select='nclients'/>",
                                            "bw_in": "<xsl:value-of select='bw_in'/>",
                                            "bw_out": "<xsl:value-of select='bw_out'/>",
                                            "bytes_in": "<xsl:value-of select='bytes_in'/>",
                                            "bytes_out": "<xsl:value-of select='bytes_out'/>"
                                        }<xsl:if test="position() != last()">,</xsl:if>
                                    </xsl:for-each>
                                ]
                            }
                        }<xsl:if test="position() != last()">,</xsl:if>
                    </xsl:for-each>
                ]
            }
        }
    </xsl:template>
</xsl:stylesheet>